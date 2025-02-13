package com.rexshop.backstage_backend.service;

import com.rexshop.backstage_backend.entity.User;
import com.rexshop.backstage_backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService { // 實現 UserDetailsService 介面

    private final UserRepository userRepository; // 注入 UserRepository

    public UserService(UserRepository userRepository) { // 注入 UserRepository
        this.userRepository = userRepository; // 設置 UserRepository
    }

    @Override // 覆寫 UserDetailsService 的 loadUserByUsername 方法
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { // 根據用戶名查找用戶
        User user = userRepository.findByUsername(username) // 查找用戶
                .orElseThrow(() -> new UsernameNotFoundException("用戶不存在")); // 用戶不存在時拋出異常
        return new org.springframework.security.core.userdetails.User(user.getUsername(), "{noop}" + user.getPassword(),
                Collections.emptyList()); // 返回用戶資訊
    }
}