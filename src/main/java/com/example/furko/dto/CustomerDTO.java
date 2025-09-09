package com.example.furko.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generiert automatisch Getter, Setter, toString, equals und hashCode Methoden für alle Felder der Klasse
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO für Kunden")
public class CustomerDTO {
    private long id;

/*    @NotBlank(message = "Name darf nicht leer sein")
    @Schema(example = "Furkan Test")*/
    private String name;

/*    @Email(message = "E-Mail muss gültig sein")
    @Schema(example = "furkan@test.de")*/
    private String email;

/*    @Size(min = 10, max = 15, message = "Telefonnummer muss zwischen 10 und 15 Zeichen sein")
    @Schema(example = "+49 123 456789")*/
    private String phoneNumber;

//    @Schema(example = "Furkanstr. 17, 12345 Teststadt")
    private String address;
}