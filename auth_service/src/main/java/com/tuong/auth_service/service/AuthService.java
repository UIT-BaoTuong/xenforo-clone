package com.tuong.auth_service.service;

import com.tuong.auth_service.dto.RegisterRequest;
import com.tuong.auth_service.dto.LoginRequest;
import com.tuong.auth_service.dto.UserProfile;
import com.tuong.auth_service.entity.User;
import com.tuong.auth_service.repository.UserRepository;
import com.tuong.auth_service.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public boolean register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) return false;
        User user = new User(request.getUsername(), request.getPassword(), request.getEmail());
        userRepository.save(user);
        return true;
    }

    public Map<String, String> login(LoginRequest request) {
        Optional<User> user = userRepository.findByUsername(request.getUsername());
        if (user.isPresent() && user.get().getPassword().equals(request.getPassword())) {
            Map<String, String> tokens = new HashMap<>();
            String accessToken = jwtTokenProvider.generateAccessToken(request.getUsername());
            String refreshToken = jwtTokenProvider.generateRefreshToken(request.getUsername());
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);
            return tokens;
        }
        return null;
    }

    public void logout(String authorization) {
        // Dummy: không làm gì
    }

    public String refreshToken(String refreshToken) {
        if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            if (username != null) {
                return jwtTokenProvider.generateAccessToken(username);
            }
        }
        return null;
    }

    public UserProfile getProfile(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.replace("Bearer ", "");
            if (jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                if (username != null) {
                    Optional<User> user = userRepository.findByUsername(username);
                    if (user.isPresent()) {
                        return new UserProfile(user.get().getUsername(), user.get().getEmail());
                    }
                }
            }
        }
        return null;
    }
}
