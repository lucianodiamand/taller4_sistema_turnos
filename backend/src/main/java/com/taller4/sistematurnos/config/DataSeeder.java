package com.taller4.sistematurnos.config;

import com.taller4.sistematurnos.entity.Profesional;
import com.taller4.sistematurnos.entity.Rol;
import com.taller4.sistematurnos.entity.Usuario;
import com.taller4.sistematurnos.repository.ProfesionalRepository;
import com.taller4.sistematurnos.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Carga datos de prueba al iniciar: un usuario por cada rol con credenciales fáciles de recordar
 * (email = password = nombre del rol en minúscula: admin/admin, profesional/profesional,
 * cliente/cliente). Es idempotente: solo crea lo que falta, así que se puede correr siempre.
 */
@Component
public class DataSeeder implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

  private final UsuarioRepository usuarioRepository;
  private final ProfesionalRepository profesionalRepository;
  private final PasswordEncoder passwordEncoder;

  public DataSeeder(
      UsuarioRepository usuarioRepository,
      ProfesionalRepository profesionalRepository,
      PasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.profesionalRepository = profesionalRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    seedUsuario("admin", "Admin Demo", Rol.ADMIN);
    seedUsuario("cliente", "Cliente Demo", Rol.CLIENTE);
    seedProfesional("profesional", "Profesional Demo");
  }

  /** Crea un usuario con password = email si todavía no existe. */
  private void seedUsuario(String email, String nombre, Rol rol) {
    if (usuarioRepository.existsByEmail(email)) {
      return;
    }
    Usuario usuario = new Usuario();
    usuario.setNombre(nombre);
    usuario.setEmail(email);
    usuario.setRol(rol);
    usuario.setPasswordHash(passwordEncoder.encode(email));
    usuario.setActivo(true);
    usuarioRepository.save(usuario);
    log.info("Seed: usuario de prueba '{}' (password '{}', rol {})", email, email, rol);
  }

  /** Crea un profesional (con su cuenta Usuario) con password = email si todavía no existe. */
  private void seedProfesional(String email, String nombre) {
    if (usuarioRepository.existsByEmail(email)) {
      return;
    }
    Usuario usuario = new Usuario();
    usuario.setNombre(nombre);
    usuario.setEmail(email);
    usuario.setRol(Rol.PROFESIONAL);
    usuario.setPasswordHash(passwordEncoder.encode(email));
    usuario.setActivo(true);

    Profesional profesional = new Profesional();
    profesional.setUsuario(usuario);
    profesional.setEspecialidad("General");
    profesional.setBio("Profesional de demostración");
    profesional.setTelefono("000-0000");

    profesionalRepository.save(profesional);
    log.info("Seed: profesional de prueba '{}' (password '{}')", email, email);
  }
}
