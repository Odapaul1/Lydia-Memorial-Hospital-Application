import { randomUUID } from "node:crypto";
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { AppointmentRequest } from "../../src/content/types";

interface AppointmentRow extends RowDataPacket {
  id: string;
  patient_name: string;
  phone: string;
  email: string | null;
  service_slug: string;
  preferred_date: string;
  preferred_time: string;
  status: AppointmentRequest["status"];
  created_at: string;
  updated_at: string;
}

const mapAppointment = (row: AppointmentRow): AppointmentRequest => ({
  id: row.id,
  patientName: row.patient_name,
  phone: row.phone,
  email: row.email,
  serviceSlug: row.service_slug,
  preferredDate: row.preferred_date,
  preferredTime: row.preferred_time,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export async function createAppointmentRequest(
  pool: Pool,
  request: Pick<AppointmentRequest, "patientName" | "phone" | "email" | "serviceSlug" | "preferredDate" | "preferredTime">,
): Promise<string> {
  const id = randomUUID();
  await pool.execute(
    `INSERT INTO appointment_requests
      (id, patient_name, phone, email, service_slug, preferred_date, preferred_time, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
    [id, request.patientName, request.phone, request.email, request.serviceSlug, request.preferredDate, request.preferredTime],
  );
  return id;
}

export async function listAppointmentRequests(
  pool: Pool,
  limit: number,
  status?: AppointmentRequest["status"],
): Promise<AppointmentRequest[]> {
  const [rows] = status
    ? await pool.execute<AppointmentRow[]>(
        `SELECT id, patient_name, phone, email, service_slug, preferred_date, preferred_time, status, created_at, updated_at
         FROM appointment_requests WHERE status = ? ORDER BY created_at DESC LIMIT ?`,
        [status, limit],
      )
    : await pool.query<AppointmentRow[]>(
        `SELECT id, patient_name, phone, email, service_slug, preferred_date, preferred_time, status, created_at, updated_at
         FROM appointment_requests ORDER BY created_at DESC LIMIT ${Math.min(200, Math.max(1, limit))}`,
      );
  return rows.map(mapAppointment);
}

export async function updateAppointmentStatus(
  pool: Pool,
  id: string,
  status: AppointmentRequest["status"],
): Promise<void> {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE appointment_requests SET status = ? WHERE id = ?",
    [status, id],
  );
  if (result.affectedRows === 0) {
    const [rows] = await pool.execute<Array<RowDataPacket & { id: string }>>(
      "SELECT id FROM appointment_requests WHERE id = ? LIMIT 1",
      [id],
    );
    if (rows.length === 0) throw new Error("request_not_found");
  }
}
