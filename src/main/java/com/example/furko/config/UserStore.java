package com.example.furko.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserStore {
    private static final Map<String, String> users = new HashMap<>();
    private static final Map<String, List<String>> roles = new HashMap<>();

    static {
        // Dummy User
        users.put("admin", "Admin123");
        users.put("user", "User123");

        // Rollen
        roles.put("admin", List.of("ROLE_ADMIN", "ROLE_USER"));
        roles.put("user", List.of("ROLE_USER"));
    }

    public static boolean validateUser(String username, String password) {
        return users.containsKey(username) && users.get(username).equals(password);
    }

    public static List<String> getRoles(String username) {
        return roles.getOrDefault(username, List.of("ROLE_USER"));
    }
}