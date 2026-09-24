package com.medicine.catalog.mapper;

import com.medicine.catalog.dto.MedicineRequest;
import com.medicine.catalog.dto.MedicineResponse;
import com.medicine.catalog.model.Medicine;

public final class MedicineMapper {

    private MedicineMapper() {
        // utility class - no instances
    }

    // Convert an incoming request DTO into a new entity
    public static Medicine toEntity(MedicineRequest request) {
        Medicine medicine = new Medicine();
        medicine.setName(request.getName());
        medicine.setDescription(request.getDescription());
        medicine.setPrice(request.getPrice());
        medicine.setQuantity(request.getQuantity());
        return medicine;
    }

    // Copy request DTO values onto an existing entity (for updates)
    public static void updateEntity(Medicine medicine, MedicineRequest request) {
        medicine.setName(request.getName());
        medicine.setDescription(request.getDescription());
        medicine.setPrice(request.getPrice());
        medicine.setQuantity(request.getQuantity());
    }

    // Owner view: full details INCLUDING stock quantity.
    public static MedicineResponse toResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getDescription(),
                medicine.getPrice(),
                medicine.getQuantity()
        );
    }

    // Public view: same details but quantity is left null,
    // so @JsonInclude(NON_NULL) drops it from the JSON entirely (stock hidden).
    public static MedicineResponse toPublicResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getDescription(),
                medicine.getPrice(),
                null // quantity hidden for the public
        );
    }
}
