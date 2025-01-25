import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as sharp from "sharp"; // Optional: Untuk resize gambar jika diperlukan

admin.initializeApp();
const storage = admin.storage();
const db = admin.firestore();

// Fungsi ini akan dipanggil ketika ada file yang di-upload ke Firebase Storage
export const resizeImageOnUpload = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name || "";
    const contentType = object.contentType;
    const fileBucket = object.bucket;
    const fileSize = Number(object.size) || 0;

    // Pastikan hanya gambar yang diproses
    if (!contentType || !contentType.startsWith("image/")) {
      console.log("Uploaded file is not an image, skipping...");
      return null;
    }

    // Ambil informasi file, seperti nama file dan folder
    const fileName = path.basename(filePath);
    const userId = filePath.split("/")[1]; // Ambil userId dari path file
    const fileType = filePath.split("/")[2]; // 'logo', 'header', 'images'

    // Tentukan lokasi file lokal temporer
    const tempLocalFile = path.join(os.tmpdir(), fileName);

    // Download file dari Firebase Storage ke lokasi sementara
    await storage
      .bucket(fileBucket)
      .file(filePath)
      .download({ destination: tempLocalFile });
    console.log("Image downloaded to:", tempLocalFile);

    // Resize gambar jika ukurannya lebih dari 1MB
    if (fileSize > 1024 * 1024) {
      // 1MB
      await sharp(tempLocalFile)
        .resize(1024) // Resize gambar ke lebar 1024px (sesuaikan dengan kebutuhan)
        .toFile(tempLocalFile);
      console.log("Image resized");
    }

    // Upload gambar yang telah di-resize kembali ke Firebase Storage di path yang sama
    const fileRef = storage.bucket(fileBucket).file(filePath);

    await fileRef.save(fs.readFileSync(tempLocalFile), {
      metadata: { contentType: contentType },
    });

    // Dapatkan URL gambar setelah upload
    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });
    console.log("Download URL:", downloadURL);

    // Update Firestore dengan URL gambar yang telah di-resize
    const villageDocRef = db.collection("villages").doc(userId);

    const updateData: any = {};
    if (fileType === "logo") {
      updateData.logo = downloadURL;
    } else if (fileType === "header") {
      updateData.header = downloadURL;
    } else if (fileType === "images") {
      // Misalnya images adalah array, update images
      const existingImages: string[] = object.metadata?.["images"] ? JSON.parse(object.metadata["images"]) : [];
      existingImages.push(downloadURL);
      updateData.images = existingImages;
    }

    await villageDocRef.update(updateData);
    console.log("Firestore document updated with URL", updateData);

    // Hapus file lokal temporer setelah selesai
    fs.unlinkSync(tempLocalFile);

    return null;
  });
