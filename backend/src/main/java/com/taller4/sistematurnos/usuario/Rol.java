package com.taller4.sistematurnos.usuario;

/**
 * Rol de un Usuario. Define qué puede hacer cada cuenta:
 * <ul>
 * <li>ADMIN: CRUD de servicios y usuarios, ve todo.</li>
 * <li>PROFESIONAL: gestiona su disponibilidad, ve/confirma sus turnos.</li>
 * <li>CLIENTE: crea/cancela sus turnos, ve servicios y disponibilidad, deja
 * reseñas.</li>
 * </ul>
 */
public enum Rol {
  ADMIN,
  PROFESIONAL,
  CLIENTE
}
