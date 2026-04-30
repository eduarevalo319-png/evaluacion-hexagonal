const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configuración de transporte SMTP. Usa tu correo real y tu "Contraseña de Aplicación".
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tu_correo@gmail.com', // ⚠️ REEMPLAZAR AQUÍ
                pass: 'tu_contrasena'        // ⚠️ REEMPLAZAR AQUÍ
            }
        });
    }

    async enviarNotificacionRecalificacion(correoDestino, solicitud) {
        if (!correoDestino) return; // Si el alumno no tiene correo registrado, cancelamos

        const mailOptions = {
            from: '"Academia de Estudios Estratégicos" <no-reply@policia.gob.ec>',
            to: correoDestino,
            subject: `Resolución de Solicitud de Recalificación - ${solicitud.estado}`,
            html: `
                <h2 style="color: #2b6cb0;">Notificación de Resolución Académica</h2>
                <p>Estimado/a estudiante,</p>
                <p>Se le informa que su solicitud de recalificación ha sido <b>${solicitud.estado}</b>.</p>
                <p><b>Motivo de su solicitud:</b> ${solicitud.motivo}</p>
                <p><b>Respuesta de la autoridad:</b> ${solicitud.respuesta}</p>
                <hr>
                <p><i>Este es un mensaje automático del sistema SIIPNE 3W. Por favor no responda a este correo.</i></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo de notificación enviado exitosamente a: ${correoDestino}`);
        } catch (error) {
            console.error("⚠️ Error al enviar el correo:", error.message);
        }
    }

    async enviarNotificacionActividad(correoDestino, estudianteNombre, asignaturaNombre, actividadNombre, nota) {
        if (!correoDestino) return;

        const mailOptions = {
            from: '"Academia de Estudios Estratégicos" <no-reply@policia.gob.ec>',
            to: correoDestino,
            subject: `Calificación Registrada - ${actividadNombre}`,
            html: `
                <h2 style="color: #2b6cb0;">Notificación de Calificación Registrada</h2>
                <p>Estimado/a estudiante <b>${estudianteNombre}</b>,</p>
                <p>Se le informa que el docente ha sincronizado su calificación correspondiente a la asignatura de <b>${asignaturaNombre}</b>.</p>
                <ul>
                    <li><b>Actividad evaluada:</b> ${actividadNombre}</li>
                    <li><b>Calificación obtenida:</b> <span style="font-size: 1.2em; font-weight: bold; color: #2f855a;">${nota} / 20</span></li>
                </ul>
                <p>Si tiene alguna novedad, recuerde que puede solicitar una recalificación a través del sistema dentro de los plazos establecidos.</p>
                <hr>
                <p><i>Este es un mensaje automático del sistema SIIPNE 3W. Por favor no responda a este correo.</i></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo de actividad enviado exitosamente a: ${correoDestino}`);
        } catch (error) {
            console.error("⚠️ Error al enviar el correo de actividad:", error.message);
        }
    }

    async enviarNotificacionPromedioAsignatura(correoDestino, estudianteNombre, asignaturaNombre, promedio, observacion) {
        if (!correoDestino) return;

        const mailOptions = {
            from: '"Academia de Estudios Estratégicos" <no-reply@policia.gob.ec>',
            to: correoDestino,
            subject: `Promedio Final Registrado - ${asignaturaNombre}`,
            html: `
                <h2 style="color: #2b6cb0;">Notificación de Promedio Final</h2>
                <p>Estimado/a estudiante <b>${estudianteNombre}</b>,</p>
                <p>Se le informa que el docente ha calculado y registrado de manera definitiva su promedio final correspondiente a la asignatura de <b>${asignaturaNombre}</b>.</p>
                <ul>
                    <li><b>Promedio Final Obtenido:</b> <span style="font-size: 1.2em; font-weight: bold; color: #2f855a;">${promedio} / 20</span></li>
                    <li><b>Estado Académico:</b> <span style="font-size: 1.1em; font-weight: bold;">${observacion}</span></li>
                </ul>
                <hr>
                <p><i>Este es un mensaje automático del sistema SIIPNE 3W. Por favor no responda a este correo.</i></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo de promedio final enviado exitosamente a: ${correoDestino}`);
        } catch (error) {
            console.error("⚠️ Error al enviar el correo de promedio final:", error.message);
        }
    }

    async enviarNotificacionModificacionCalificacion(correoDestino, estudianteNombre, asignaturaNombre, actividadNombre, notaAnterior, notaNueva) {
        if (!correoDestino) return;

        const mailOptions = {
            from: '"Academia de Estudios Estratégicos" <no-reply@policia.gob.ec>',
            to: correoDestino,
            subject: `Modificación de Calificación Registrada - ${asignaturaNombre}`,
            html: `
                <h2 style="color: #2b6cb0;">Notificación de Modificación de Calificación</h2>
                <p>Estimado/a estudiante <b>${estudianteNombre}</b>,</p>
                <p>Se le informa que el docente de la asignatura ha realizado una modificación formal sobre su calificación correspondiente a <b>${asignaturaNombre}</b>.</p>
                <ul style="background: #f7fafc; padding: 15px; border-radius: 8px; list-style-type: none;">
                    <li><b>Actividad Evaluativa:</b> ${actividadNombre}</li>
                    <li style="margin-top: 10px;"><b>Calificación Anterior:</b> <span style="color: #e53e3e; text-decoration: line-through;">${notaAnterior} / 20</span></li>
                    <li style="margin-top: 10px;"><b>Nueva Calificación Definitiva:</b> <span style="font-size: 1.2em; font-weight: bold; color: #2f855a;">${notaNueva} / 20</span></li>
                </ul>
                <p>El documento de respaldo y la justificación de este cambio reposan en el sistema bajo estricta auditoría.</p>
                <hr>
                <p><i>Este es un mensaje automático del sistema SIIPNE 3W. Por favor no responda a este correo.</i></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo de modificación enviado exitosamente a: ${correoDestino}`);
        } catch (error) {
            console.error("⚠️ Error al enviar el correo de modificación:", error.message);
        }
    }

    async enviarNotificacionPromedioFinal(correoDestino, estudianteNombre, promocionNombre, promedio, estado) {
        if (!correoDestino) return;

        const mailOptions = {
            from: '"Academia de Estudios Estratégicos" <no-reply@policia.gob.ec>',
            to: correoDestino,
            subject: `Notificación Oficial de Promedio Final - ${promocionNombre}`,
            html: `
                <h2 style="color: #2b6cb0;">Notificación Oficial de Promedio Final</h2>
                <p>Estimado/a estudiante <b>${estudianteNombre}</b>,</p>
                <p>La Academia de Estudios Estratégicos le informa que se ha ejecutado el cálculo del reporte consolidado de calificaciones correspondiente a la <b>${promocionNombre}</b>.</p>
                <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2b6cb0; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 1.1em;"><b>Promedio Final Obtenido:</b> <span style="font-size: 1.3em; color: #2b6cb0;">${promedio} / 20</span></p>
                    <p style="margin: 0; font-size: 1.1em;"><b>Condición Académica:</b> <span style="font-size: 1.2em; font-weight: bold; color: ${estado === 'APROBADO' ? '#2f855a' : '#e53e3e'};">${estado}</span></p>
                </div>
                <p>Este resultado ha sido validado considerando el rendimiento reglamentario en todas las asignaturas cuantitativas y cualitativas de la malla curricular.</p>
                <hr>
                <p><i>Este es un mensaje automático del sistema SIIPNE 3W. Por favor no responda a este correo.</i></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo de promedio general enviado exitosamente a: ${correoDestino}`);
        } catch (error) {
            console.error("⚠️ Error al enviar el correo de promedio general:", error.message);
        }
    }
}

module.exports = EmailService;