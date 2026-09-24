package com.medicine.catalog.service;

import com.medicine.catalog.dto.MedicineRequest;
import com.medicine.catalog.dto.MedicineResponse;
import com.medicine.catalog.mapper.MedicineMapper;
import com.medicine.catalog.model.Medicine;
import com.medicine.catalog.repository.MedicineRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class MedicineService {

    private final MedicineRepository repository;

    public MedicineService(MedicineRepository repository) {
        this.repository = repository;
    }

    // Decide which view to use based on the current caller:
    // an authenticated ROLE_OWNER gets the full response (with stock),
    // everyone else (public/customer) gets the response without stock.
    private Function<Medicine, MedicineResponse> currentViewMapper() {
        return isOwner() ? MedicineMapper::toResponse : MedicineMapper::toPublicResponse;
    }

    private boolean isOwner() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if ("ROLE_OWNER".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    // List all medicines, or search by name if a search term is given
    public List<MedicineResponse> getMedicines(String search) {
        List<Medicine> medicines;
        if (search != null && !search.isBlank()) {
            medicines = repository.findByNameContainingIgnoreCase(search);
        } else {
            medicines = repository.findAll();
        }
        Function<Medicine, MedicineResponse> mapper = currentViewMapper();
        return medicines.stream()
                .map(mapper)
                .toList();
    }

    // Get one medicine by id (empty if not found)
    public Optional<MedicineResponse> getMedicine(Long id) {
        return repository.findById(id)
                .map(currentViewMapper());
    }

    // Add a new medicine
    public MedicineResponse addMedicine(MedicineRequest request) {
        Medicine saved = repository.save(MedicineMapper.toEntity(request));
        return MedicineMapper.toResponse(saved);
    }

    // Update an existing medicine; empty if the id does not exist
    public Optional<MedicineResponse> updateMedicine(Long id, MedicineRequest request) {
        return repository.findById(id)
                .map(existing -> {
                    MedicineMapper.updateEntity(existing, request);
                    return MedicineMapper.toResponse(repository.save(existing));
                });
    }

    // Delete a medicine; returns true if it existed and was deleted
    public boolean deleteMedicine(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
