package com.taller4.sistematurnos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Alta/edición de un profesional. La password se usa solo en el alta para crear la cuenta del
 * profesional (se hashea en el service); el rol del usuario lo fija el server en PROFESIONAL.
 */
public record ProfesionalEntradaDTO(
    Long id,
    @NotNull @Valid UsuarioEntradaDTO usuario,
    @NotBlank @Size(min = 6, max = 100) String password,
    @NotBlank @Size(max = 100) String especialidad,
    String bio,
    @Size(max = 20) String telefono) {}
