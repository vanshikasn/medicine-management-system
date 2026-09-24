package com.medicine.catalog.controller;

import com.medicine.catalog.dto.MedicineRequest;
import com.medicine.catalog.dto.MedicineResponse;
import com.medicine.catalog.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService service;

    public MedicineController(MedicineService service) {
        this.service = service;
    }

    // List all medicines, or search by name if "search" is provided
    @GetMapping
    public List<MedicineResponse> getMedicines(@RequestParam(required = false) String search) {
        return service.getMedicines(search);
    }

    // Get one medicine by id
    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponse> getMedicine(@PathVariable Long id) {
        return service.getMedicine(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a new medicine -> 201 Created
    @PostMapping
    public ResponseEntity<MedicineResponse> addMedicine(@Valid @RequestBody MedicineRequest request) {
        MedicineResponse created = service.addMedicine(request);
        return ResponseEntity.status(201).body(created);
    }

    // Update an existing medicine
    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(@PathVariable Long id,
                                                           @Valid @RequestBody MedicineRequest request) {
        return service.updateMedicine(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        boolean deleted = service.deleteMedicine(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
