package com.example.furko.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class JwtUtil {
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    // Token erstellen
    public static String generateToken (String username, List<String> roles) {
        return Jwts.builder()
                .setSubject(username) // Username kommt ins Token
                .claim("roles", roles) // Rollen hinzufügen
                .setClaims(Map.of("roles", roles))
                .setIssuedAt(new Date()) // Token-Erstellungszeit
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Token läuft nach einer Stunde ab
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Token validieren & Username auslesen
    public static String validateTokenAndGetUsername(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject(); // Username wird abgeholt
        } catch (Exception e) {
            return null; // Token ist ungültig -> Es wird kein Username zurückgegeben
        }
    }

    // Rollen beim validieren auslesen
    public static List<String> getRolesFromToken(String token) {
        try {
            return ((List<?>) Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .get("roles")).stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return null;
        }
    }
}