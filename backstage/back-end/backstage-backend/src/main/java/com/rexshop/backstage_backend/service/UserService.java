package com.rexshop.backstage_backend.service;

import com.rexshop.backstage_backend.entity.User;
import com.rexshop.backstage_backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用戶不存在"));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), "{noop}" + user.getPassword(),
                Collections.emptyList());
    }
}