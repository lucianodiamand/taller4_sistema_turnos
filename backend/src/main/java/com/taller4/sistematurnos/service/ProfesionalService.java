package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.ProfesionalEntradaDTO;
import com.taller4.sistematurnos.dto.ProfesionalSalidaDTO;
import com.taller4.sistematurnos.entity.Profesional;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.mapper.ProfesionalMapper;
import com.taller4.sistematurnos.repository.ProfesionalRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** ABM de profesionales. Maneja el ciclo de vida del Usuario en cascada. */
@Service
@Transactional
public class ProfesionalService {

  private final ProfesionalRepository profesionalRepository;

  public ProfesionalService(ProfesionalRepository profesionalRepository) {
    this.profesionalRepository = profesionalRepository;
  }

  @Transactional(readOnly = true)
  public List<ProfesionalSalidaDTO> listar() {
    return profesionalRepository.findAll().stream().map(ProfesionalMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public ProfesionalSalidaDTO obtener(Long id) {
    return ProfesionalMapper.toDto(buscar(id));
  }

  public ProfesionalSalidaDTO crear(ProfesionalEntradaDTO dto) {
    Profesional profesional = ProfesionalMapper.toEntity(dto);
    Profesional profesionalGuardado =
        Objects.requireNonNull(profesionalRepository.save(profesional));
    return ProfesionalMapper.toDto(profesionalGuardado);
  }

  public ProfesionalSalidaDTO actualizar(Long id, ProfesionalEntradaDTO dto) {
    Profesional profesional = buscar(id);

    profesional.setEspecialidad(dto.especialidad());
    profesional.setBio(dto.bio());
    profesional.setTelefono(dto.telefono());

    if (profesional.getUsuario() != null && dto.usuario() != null) {
      profesional.getUsuario().setNombre(dto.usuario().nombre());
      profesional.getUsuario().setEmail(dto.usuario().email());
      profesional.getUsuario().setRol(dto.usuario().rol());
      profesional.getUsuario().setActivo(dto.usuario().activo());
    }

    Profesional profesionalActualizado =
        Objects.requireNonNull(profesionalRepository.save(profesional));
    return ProfesionalMapper.toDto(profesionalActualizado);
  }

  public void eliminar(Long id) {
    profesionalRepository.delete(buscar(id));
  }

  private Profesional buscar(Long id) {
    Long idBuscar = Objects.requireNonNull(id, "El id no puede ser nulo");
    Profesional profesional =
        profesionalRepository
            .findById(idBuscar)
            .orElseThrow(() -> new RecursoNoEncontradoException("Profesional", idBuscar));
    return Objects.requireNonNull(profesional);
  }
}
