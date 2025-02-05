package com.rexshop.backstage_backend.controller;

import com.rexshop.backstage_backend.dto.LoginRequest;
import com.rexshop.backstage_backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // 驗證使用者帳號密碼並產生 JWT Token
            String token = authService.login(loginRequest);

            // 設定 HttpOnly Cookie
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setDomain("localhost"); // 設置網域
            response.addCookie(cookie);

            System.out.println("JWT Token set in Cookie: " + token); // 調試代碼，檢查是否設置了 JWT

            return ResponseEntity.ok("登入成功！");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("登入失敗！");
        } catch (Exception e) {
            e.printStackTrace(); // 顯示異常訊息
            return ResponseEntity.status(500).body("伺服器錯誤！");
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@CookieValue("jwt") String token) {
        System.out.println("JWT Token: " + token); // 調試代碼，檢查是否獲取到 JWT
        // 解碼 JWT Token 並返回使用者資訊
        String username = authService.getUsernameFromToken(token);
        System.out.println("Username: " + username); // 調試代碼，檢查是否解析到用戶名
        return ResponseEntity.ok().body(Collections.singletonMap("username", username));
    }
}