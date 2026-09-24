package com.medicine.catalog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

// @JsonInclude(NON_NULL): fields that are null are left OUT of the JSON.
// So when quantity is null (public view), it won't appear in the response at all.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MedicineResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity; // included only for the owner; null (hidden) for public
}
