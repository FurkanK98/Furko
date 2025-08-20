package com.example.furko.controller;

import com.example.furko.entity.Invoice;
import com.example.furko.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    // 1. Alle Rechnungen
    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoice() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // 2. Einzelne Rechnung abrufen
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoice(id));
    }

    // 3. Neue Rechnung für einen Kunden
    @PostMapping("/{customerID}")
    public ResponseEntity<Invoice> createInvoice(@PathVariable("customerID") Long customerID, @RequestBody Invoice invoiceRequest) {
        return ResponseEntity.ok(invoiceService.createInvoice(customerID, invoiceRequest.getAmount()));
    }

    // 4. Rechnung bezahlen
    @PutMapping("/{id}/pay")
    public ResponseEntity<Invoice> payInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.payInvoice(id));
    }

    // 5. Rechnung löschen
    @DeleteMapping("/{id}")
    public ResponseEntity<Invoice> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}