package com.tuong.auth_service.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;
import com.tuong.auth_service.dto.RegisterRequest;
import com.tuong.auth_service.dto.LoginRequest;
import com.tuong.auth_service.dto.UserProfile;
import com.tuong.auth_service.service.AuthService;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

  @Autowired
  private AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    boolean success = authService.register(request);
    if (success) {
      return ResponseEntity.ok("Register success");
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Register failed");
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    Map<String, String> tokens = authService.login(request);
    if (tokens != null) {
      return ResponseEntity.ok(tokens);
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
    authService.logout(authorization);
    return ResponseEntity.ok("Logout success");
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
    String refreshToken = body.get("refreshToken");
    String newAccessToken = authService.refreshToken(refreshToken);
    if (newAccessToken != null) {
      Map<String, String> result = new HashMap<>();
      result.put("accessToken", newAccessToken);
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authorization) {
    UserProfile profile = authService.getProfile(authorization);
    if (profile != null) {
      return ResponseEntity.ok(profile);
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
  }
}