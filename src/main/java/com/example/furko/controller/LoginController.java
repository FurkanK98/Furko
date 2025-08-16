package com.example.furko.controller;

import com.example.furko.dto.JwtResponse;
import com.example.furko.dto.LoginRequest;
import com.example.furko.service.LoginService;
import com.example.furko.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoginController {
    private final LoginService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean validUser = userService.checkCredentials(loginRequest.getUsername(), loginRequest.getPassword());

        if(!validUser) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültigte Anmeldedaten");
        }

        // Token generieren & zurückgeben
        String token = JwtUtil.generateToken(loginRequest.getUsername());
        return ResponseEntity.ok(new JwtResponse(token));
    }
}