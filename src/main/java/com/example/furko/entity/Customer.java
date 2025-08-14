package com.example.furko.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Erlaubt dir, Objekte bequem und lesbar mit „Baumeister-Style“ zu erstellen, z.B. Customer.builder().name("Furki").email("f@x.de").build();
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String address;

    private LocalDateTime createdAt;

    @PrePersist // Führt die Methode vor dem Erst-Speichern in die Datenbank automatisch aus — hier setzen wir z.B. das Erstellungsdatum automatisch.
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

/*
package com.example.furko.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String address;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Manueller Builder
    public static class Builder {
        private String name;
        private String email;
        private String phoneNumber;
        private String address;

        public Builder name(String name) {
            this.name = name;
            return this;
        }
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        public Builder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        public Customer build() {
            Customer c = new Customer();
            c.setName(name);
            c.setEmail(email);
            c.setPhoneNumber(phoneNumber);
            c.setAddress(address);
            return c;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}*/
