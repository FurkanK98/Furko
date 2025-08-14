package com.example.furko.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    public boolean checkCredentials(String username, String password) {
        return "admin".equals(username) && "pass".equals(password);
    }
}