export interface ManualOrderData {
  ideaIds: string[];
}

export class ManualOrderService {
  private static readonly API_BASE = "/api/manual-order";

  /**
   * Load manual order for a specific department
   */
  static async loadManualOrder(
    department: string,
    userId: string = "default"
  ): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}?department=${encodeURIComponent(
          department
        )}&userId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load manual order: ${response.statusText}`);
      }

      const data: ManualOrderData = await response.json();
      return data.ideaIds;
    } catch (error) {
      console.error("Error loading manual order:", error);
      return [];
    }
  }

  /**
   * Save manual order for a specific department
   */
  static async saveManualOrder(
    department: string,
    ideaIds: string[],
    userId: string = "default"
  ): Promise<boolean> {
    try {
      const response = await fetch(this.API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department,
          ideaIds,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save manual order: ${response.statusText}`);
      }

      const result = await response.json();
      return result.ok === true;
    } catch (error) {
      console.error("Error saving manual order:", error);
      return false;
    }
  }
}
