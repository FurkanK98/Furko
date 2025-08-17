package com.example.furko.controller;

import com.example.furko.config.UserStore;
import com.example.furko.dto.JwtResponse;
import com.example.furko.dto.LoginRequest;
import com.example.furko.service.LoginService;
import com.example.furko.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoginController {
    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
/*        // Dummy: Wenn der Username "admin" ist, dann kriegt er die Admin-Rolle, sonst normaler User
        List<String> roles = loginRequest.getUsername().equals("admin")
                ? List.of("ROLE_ADMIN")
                : List.of("ROLE_USER");*/

        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if(!UserStore.validateUser(username, password)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Ungültige Login-Daten!");
        }

        List<String> roles = UserStore.getRoles(username);
        String token = JwtUtil.generateToken(username, roles);

/*        boolean validUser = userService.checkCredentials(loginRequest.getUsername(), loginRequest.getPassword());

        if(!validUser) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültigte Anmeldedaten");
        }*/

        // Token generieren & zurückgeben
//        String token = JwtUtil.generateToken(loginRequest.getUsername(), roles);
        return ResponseEntity.ok(new JwtResponse(token));
    }
}