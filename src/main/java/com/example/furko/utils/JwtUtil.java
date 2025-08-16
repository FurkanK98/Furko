package com.example.furko.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    // Token erstellen
    public static String generateToken (String username) {
        return Jwts.builder()
                .setSubject(username) // Username kommt ins Token
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

            return claims.getSubject(); // Username wird abgeholt.
        } catch (Exception e) {
            return null; // Token ist ungültig -> Es wird kein Username zurückgegeben.
        }
    }
}