package com.rexshop.backstage_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class S3Service {

    @Autowired
    private S3Client s3Client; // S3Client 是 AWS SDK 提供的類別，用來與 S3 服務進行互動

    private String bucketName = "carlos-shopping-online"; // S3 bucket 名稱

    public String uploadFile(MultipartFile multipartFile) { // 上傳檔案到 S3
        File file = convertMultiPartToFile(multipartFile); // 將 MultipartFile 轉換成 File
        String fileName = System.currentTimeMillis() + "_" + multipartFile.getOriginalFilename(); // 檔案名稱
        String fileUrl = "https://" + bucketName + ".s3.ap-northeast-1.amazonaws.com/" + fileName; // 檔案 URL

        PutObjectRequest putObjectRequest = PutObjectRequest.builder() // 建立 PutObjectRequest 物件
                .bucket(bucketName) // 指定 bucket 名稱
                .key(fileName) // 指定檔案名稱
                .contentType(multipartFile.getContentType()) // 指定檔案類型
                .build(); // 建立 PutObjectRequest 物件

        try { // 上傳檔案到 S3
            s3Client.putObject(putObjectRequest, Paths.get(file.getPath())); // 使用 S3Client 的 putObject 方法上傳檔案
            Files.deleteIfExists(file.toPath()); // 刪除本地端暫存檔案
            return fileUrl; // 回傳檔案 URL
        } catch (Exception e) { // 如果上傳失敗，拋出 RuntimeException
            e.printStackTrace(); // 印出錯誤訊息
            throw new RuntimeException("Failed to upload file to S3", e); // 拋出 RuntimeException
        }
    }

    private File convertMultiPartToFile(MultipartFile file) { // 將 MultipartFile 轉換成 File
        try { // 將 MultipartFile 轉換成 File
            File convFile = Files.createTempFile("temp", file.getOriginalFilename()).toFile(); // 建立暫存檔案
            file.transferTo(convFile); // 將 MultipartFile 寫入暫存檔案
            return convFile; // 回傳暫存檔案
        } catch (IOException e) { // 如果轉換失敗，拋出 RuntimeException
            e.printStackTrace(); // 印出錯誤訊息
            throw new RuntimeException("Error converting multipart file to file", e); // 拋出 RuntimeException
        }
    }
}