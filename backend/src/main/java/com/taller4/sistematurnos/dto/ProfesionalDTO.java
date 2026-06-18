package com.taller4.sistematurnos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfesionalDTO(
    Long id,
    @NotNull @Valid UsuarioDTO usuario,
    @NotBlank @Size(max = 100) String especialidad,
    String bio,
    @Size(max = 20) String telefono) {
}
