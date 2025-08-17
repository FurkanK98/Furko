package com.example.furko.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. Login-Endpoint explizit freigeben (kein Token nötig)
        String path = request.getServletPath();
        if(path.equals("/api/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Token aus dem Header holen
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7); // "Bearer "wird abgeschnitten, nur der Token bleibt.
        String username = JwtUtil.validateTokenAndGetUsername(token); // Token wird mit dem User gematched.
        List<String> roles = JwtUtil.getRolesFromToken(token);

        // 3. Token validieren
        if(username != null && roles != null) {
            // 4. User im SecurityContext speichern. (User ist ab hier eingeloggt)
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // RBAC - Role-Based Access Control
            if(path.startsWith("/api/customers/admin") && !roles.contains("ROLE_ADMIN")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Fehlermeldung 401
        }

        // 5. Weiter im Filter-Chain
        filterChain.doFilter(request, response);
    }
}