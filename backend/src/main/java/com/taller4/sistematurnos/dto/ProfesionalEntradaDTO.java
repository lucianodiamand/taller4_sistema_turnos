package com.taller4.sistematurnos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfesionalEntradaDTO(
    Long id,
    @NotNull @Valid UsuarioEntradaDTO usuario,
    @NotBlank @Size(max = 100) String especialidad,
    String bio,
    @Size(max = 20) String telefono) {
}
