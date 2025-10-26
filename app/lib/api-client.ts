import { PatientDashboard, VitalSign, LabResult, Appointment, PendingBill } from './types/patient';

class ApiClient {
  private baseUrl = '/api/patient';

  async fetchWithAuth(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${data.error || 'Unknown error'}`);
    }

    // Return the standardized response data
    return data.success ? data : data;
  }

  // Dashboard summary
  async getDashboard(): Promise<PatientDashboard> {
    return this.fetchWithAuth(`${this.baseUrl}/dashboard`);
  }

  // Appointments
  async getUpcomingAppointments(): Promise<{ appointments: Appointment[] }> {
    return this.fetchWithAuth(`${this.baseUrl}/appointments/upcoming`);
  }

  // Lab Results
  async getRecentLabResults(): Promise<{ labResults: LabResult[] }> {
    return this.fetchWithAuth(`${this.baseUrl}/lab-results/recent`);
  }

  async getAllLabResults(): Promise<{ labResults: LabResult[] }> {
    return this.fetchWithAuth(`${this.baseUrl}/lab-results`);
  }

  // Bills
  async getPendingBills(): Promise<{ bills: PendingBill[] }> {
    return this.fetchWithAuth(`${this.baseUrl}/bills/pending`);
  }

  // Health Trends
  async getHealthTrends(): Promise<{ vitalSigns: VitalSign[] }> {
    return this.fetchWithAuth(`${this.baseUrl}/health-trends`);
  }

  // Medications
  async getMedications() {
    return this.fetchWithAuth(`${this.baseUrl}/medications`);
  }
}

export const apiClient = new ApiClient();