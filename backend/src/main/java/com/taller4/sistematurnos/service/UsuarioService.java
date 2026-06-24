package com.taller4.sistematurnos.service;

import com.taller4.sistematurnos.dto.UsuarioEntradaDTO;
import com.taller4.sistematurnos.dto.UsuarioSalidaDTO;
import com.taller4.sistematurnos.entity.Usuario;
import com.taller4.sistematurnos.exception.RecursoNoEncontradoException;
import com.taller4.sistematurnos.mapper.UsuarioMapper;
import com.taller4.sistematurnos.repository.UsuarioRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** ABM de usuarios. */
@Service
@Transactional
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Transactional(readOnly = true)
  public List<UsuarioSalidaDTO> listar() {
    return usuarioRepository.findAll().stream().map(UsuarioMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public UsuarioSalidaDTO obtener(Long id) {
    return UsuarioMapper.toDto(buscar(id));
  }

  public UsuarioSalidaDTO crear(UsuarioEntradaDTO dto) {
    Usuario usuario = UsuarioMapper.toEntity(dto);
    Usuario usuarioGuardado = Objects.requireNonNull(usuarioRepository.save(usuario));
    return UsuarioMapper.toDto(usuarioGuardado);
  }

  public UsuarioSalidaDTO actualizar(Long id, UsuarioEntradaDTO dto) {
    Usuario usuario = buscar(id);
    usuario.setNombre(dto.nombre());
    usuario.setEmail(dto.email());
    usuario.setRol(dto.rol());
    usuario.setActivo(dto.activo());

    Usuario usuarioActualizado = Objects.requireNonNull(usuarioRepository.save(usuario));
    return UsuarioMapper.toDto(usuarioActualizado);
  }

  public void eliminar(Long id) {
    usuarioRepository.delete(buscar(id));
  }

  private Usuario buscar(Long id) {
    Long idBuscar = Objects.requireNonNull(id, "El id no puede ser nulo");

    Usuario usuario =
        usuarioRepository
            .findById(idBuscar)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", idBuscar));

    return Objects.requireNonNull(usuario);
  }
}
