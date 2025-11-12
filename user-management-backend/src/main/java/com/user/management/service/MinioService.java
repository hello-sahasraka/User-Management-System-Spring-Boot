package com.user.management.service;

import io.minio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    public String upload(MultipartFile image) throws Exception {

        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(image.getOriginalFilename())
                            .stream(image.getInputStream(), image.getSize(), -1)
                            .contentType(image.getContentType())
                            .build()
            );
            return "http://localhost:9000/" + bucketName + "/" + image.getOriginalFilename();
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to MinIO: " + e.getMessage(), e);
        }
    }

    public void delete(String imageName) throws Exception {
            try {
                minioClient.removeObject(
                        RemoveObjectArgs.builder()
                                .bucket(bucketName)
                                .object(imageName)
                                .build()
                );
                System.out.println("Deleted: " + imageName);
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete file from MinIO: " + e.getMessage(), e);
            }
    }
}
