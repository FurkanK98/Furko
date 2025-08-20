package com.example.furko.controller;

import com.example.furko.entity.Payment;
import com.example.furko.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // Zahlung erstellen
    @PostMapping("/{invoiceID}")
    public ResponseEntity<Payment> createPayment(@PathVariable Long invoiceID, @RequestBody Payment paymentRequest) {
        return ResponseEntity.ok(paymentService.createPayment(invoiceID, paymentRequest.getAmount(), paymentRequest.getMethod()));
    }

    // Alle Zahlungen abrufen
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayment() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // Alle Zahlungen für eine Rechnung abrufen
    @GetMapping("invoice/{invoiceID}")
    public ResponseEntity<List<Payment>> getPaymentsByInvoice(@PathVariable Long invoiceID) {
        List<Payment> payments = paymentService.getPaymentsByInvoice(invoiceID);
        return ResponseEntity.ok(payments);
    }

    // Einzelne Zahlungen abrufen
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    // Einzelne Zahlungen löschen
    @DeleteMapping("/{id}")
    public ResponseEntity<Payment> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}