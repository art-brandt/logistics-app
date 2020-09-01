export default {
  baseURL: 'http://localhost:3000',
  async getRequisitions(page = 1, perPage = 10) {
    const url = new URL('/requisitions', this.baseURL);
    const query = new URLSearchParams();
    query.append('page', page);
    query.append('perPage', perPage);
    url.search = query.toString();
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error([response.statusText, json.message].join('. '));
    }
    return json;
  },
  async createRequisition(requisition) {
    const url = new URL('/requisitions', this.baseURL);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requisition),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error([response.statusText, json.message].join('. '));
    }
    return json;
  },
  async removeRequisition(id) {
    const url = new URL(`/requisitions/${id}`, this.baseURL);
    const response = await fetch(url.toString(), { method: 'DELETE' });
    const json = await response.json();
    if (!response.ok) {
      throw new Error([response.statusText, json.message].join('. '));
    }
    return json;
  },
  async updateRequisition(id, requisition) {
    const url = new URL(`/requisitions/${id}`, this.baseURL);
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requisition),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error([response.statusText, json.message].join('. '));
    }
    return json;
  },
};
