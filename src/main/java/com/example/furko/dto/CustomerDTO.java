package com.example.furko.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data // Generiert automatisch Getter, Setter, toString, equals und hashCode Methoden für alle Felder der Klasse
public class CustomerDTO {
    @NotBlank(message = "Name darf nicht leer sein")
    private String name;

    @Email(message = "E-Mail muss gültig sein")
    private String email;

    @Size(min = 10, max = 15, message = "Telefonnummer muss zwischen 10 und 15 Zeichen sein")
    private String phoneNumber;

    private String address;
}