export class MockDB<T extends { id: string }> {
  private data: T[];

  constructor(initialData: T[]) {
    this.data = [...initialData];
  }

  findAll(): T[] {
    return [...this.data];
  }

  findById(id: string): T | undefined {
    return this.data.find(item => item.id === id);
  }

  create(item: T): T {
    this.data.push(item);
    return item;
  }

  update(id: string, updates: Partial<T>): T | null {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[index] = { ...this.data[index], ...updates };
    return this.data[index];
  }

  delete(id: string): boolean {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    return true;
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }

  paginate(page: number, limit: number): { data: T[]; total: number } {
    const start = (page - 1) * limit;
    return {
      data: this.data.slice(start, start + limit),
      total: this.data.length,
    };
  }

  search(query: string, fields: (keyof T)[]): T[] {
    const q = query.toLowerCase();
    return this.data.filter(item =>
      fields.some(f => String(item[f]).toLowerCase().includes(q))
    );
  }

  sort(field: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...this.data].sort((a, b) => {
      const va = a[field], vb = b[field];
      if (va < vb) return direction === 'asc' ? -1 : 1;
      if (va > vb) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
