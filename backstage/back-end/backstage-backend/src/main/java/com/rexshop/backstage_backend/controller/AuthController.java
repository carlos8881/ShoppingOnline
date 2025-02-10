package com.rexshop.backstage_backend.controller;

import com.rexshop.backstage_backend.dto.LoginRequest;
import com.rexshop.backstage_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) { // 注入 AuthService 服務
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) { // 接收使用者登入請求
        try { // 處理可能的異常
              // 驗證使用者帳號密碼並產生 JWT Token
            String token = authService.login(loginRequest); // 登入並獲取 JWT Token

            System.out.println("JWT Token: " + token); // 檢查是否生成了 JWT

            // 返回 JWT Token 作為響應的一部分
            return ResponseEntity.ok(Collections.singletonMap("token", token)); // 返回 JWT Token
        } catch (BadCredentialsException e) { // 處理帳號密碼錯誤
            return ResponseEntity.status(401).body("登入失敗！"); // 返回 401 狀態碼
        } catch (Exception e) { // 處理其他異常
            e.printStackTrace(); // 顯示異常訊息
            return ResponseEntity.status(500).body("伺服器錯誤！"); // 返回 500 狀態碼
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) { // 接收 JWT Token
        System.out.println("JWT Token: " + token); // 檢查是否獲取到 JWT
        // 解碼 JWT Token 並返回使用者資訊
        String username = authService.getUsernameFromToken(token.replace("Bearer ", "")); // 解碼 JWT Token
        System.out.println("Username: " + username); // 檢查是否取得用戶名
        return ResponseEntity.ok().body(Collections.singletonMap("username", username)); // 返回用戶名
    }
}