package com.taller4.sistematurnos.turno;

/**
 * Estado de un Turno a lo largo de su ciclo de vida:
 * <ul>
 *   <li>PENDIENTE: reservado por el cliente, falta confirmación del profesional.</li>
 *   <li>CONFIRMADO: el profesional confirmó el turno.</li>
 *   <li>CANCELADO: cancelado por cliente o profesional antes de la fecha.</li>
 *   <li>COMPLETADO: el turno se realizó.</li>
 *   <li>NO_ASISTIO: el cliente no se presentó.</li>
 * </ul>
 */
public enum EstadoTurno {
    PENDIENTE,
    CONFIRMADO,
    CANCELADO,
    COMPLETADO,
    NO_ASISTIO
}
