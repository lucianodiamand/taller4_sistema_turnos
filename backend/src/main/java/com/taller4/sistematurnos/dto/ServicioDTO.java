package com.taller4.sistematurnos.dto;

import java.math.BigDecimal;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotNull;

@Data
public class ServicioDTO {

    private Long id;
    
    @NotBlank
    private String nombre;
    
    @NotBlank
    private String descripcion;
    
    @NotNull
    @Positive
    private Integer duracionMin;
    
    @NotNull
    @Positive
    private BigDecimal precio;

}