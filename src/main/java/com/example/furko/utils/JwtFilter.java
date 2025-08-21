package com.example.furko.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Login-Endpoint explizit freigeben (kein Token nötig)
        String path = request.getServletPath();

        // Swagger & Login-Endpunkte komplett freigeben
        if (path.equals("/api/login") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("swagger-resources") || path.startsWith("/webjars/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Token aus dem Header holen
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7); // "Bearer "wird abgeschnitten, nur der Token bleibt.
        String username = JwtUtil.validateTokenAndGetUsername(token); // Token wird mit dem User gematched.
        List<String> roles = JwtUtil.getRolesFromToken(token);

        // Token validieren
        if(username != null && roles != null) {
            // User im SecurityContext speichern. (User ist ab hier eingeloggt)
            System.out.println("Eingeloggter User: " + username);
            System.out.println("Rollen aus dem Token: " + roles);
            System.out.println("Angefragter Path: " + request.getServletPath());

            var authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // RBAC Überprüfung - Role-Based Access Control
            if(path.startsWith("/api/customers/admin") && !roles.contains("ROLE_ADMIN")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Fehlermeldung 401
        }

        // Weiter im Filter-Chain
        filterChain.doFilter(request, response);
    }
}