package com.taller4.sistematurnos.controller;

import com.taller4.sistematurnos.dto.UsuarioEntradaDTO;
import com.taller4.sistematurnos.dto.UsuarioSalidaDTO;
import com.taller4.sistematurnos.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuario", description = "Gestión de usuarios y clientes del sistema")
public class UsuarioController {

  private final UsuarioService service;

  public UsuarioController(UsuarioService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Crear un usuario")
  public UsuarioSalidaDTO crear(@Valid @RequestBody UsuarioEntradaDTO dto) {
    return service.crear(dto);
  }

  @GetMapping
  @Operation(summary = "Listar todos los usuarios")
  public List<UsuarioSalidaDTO> listar() {
    return service.listar();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Obtener un usuario por id")
  public UsuarioSalidaDTO obtener(@PathVariable Long id) {
    return service.obtener(id);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Actualizar un usuario")
  public UsuarioSalidaDTO actualizar(
      @PathVariable Long id, @Valid @RequestBody UsuarioEntradaDTO dto) {
    return service.actualizar(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Eliminar un usuario")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
