package com.rexshop.backstage_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackstageBackendApplication {

	public static void main(String[] args) {
		// 加載 .env 文件中的環境變量
		Dotenv dotenv = Dotenv.configure()
				.directory("F:/ShoppingOnline/backstage/back-end/backstage-backend")
				.load();

		// 將 .env 文件中的變量設置為系統屬性
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		// 啟動 Spring Boot 應用程序
		SpringApplication.run(BackstageBackendApplication.class, args);
	}
}