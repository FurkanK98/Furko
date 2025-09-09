package com.example.furko.service;

import org.springframework.stereotype.Service;

@Service
public class LoginService {
    public boolean checkCredentials(String username, String password) {
        return "admin".equals(username) && "Admin123".equals(password);
    }
}