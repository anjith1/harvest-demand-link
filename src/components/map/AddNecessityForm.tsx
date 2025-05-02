
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Necessity {
  item: string;
  quantity: number;
  unit: string;
}

interface AddNecessityFormProps {
  onSubmit: (data: { name: string; necessities: Necessity[] }) => void;
  onCancel: () => void;
}

const unitOptions = ['kg', 'liters', 'pieces', 'bags', 'boxes', 'cans'];

const AddNecessityForm: React.FC<AddNecessityFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.name || '';
    }
    return '';
  });
  const [necessities, setNecessities] = useState<Necessity[]>([
    { item: '', quantity: 1, unit: 'kg' }
  ]);

  const handleNecessityChange = (index: number, field: keyof Necessity, value: string | number) => {
    const updatedNecessities = [...necessities];
    updatedNecessities[index] = { ...updatedNecessities[index], [field]: value };
    setNecessities(updatedNecessities);
  };

  const addNecessityField = () => {
    setNecessities([...necessities, { item: '', quantity: 1, unit: 'kg' }]);
  };

  const removeNecessityField = (index: number) => {
    if (necessities.length > 1) {
      setNecessities(necessities.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const validNecessities = necessities.filter(n => n.item.trim() !== '');
    if (validNecessities.length === 0) {
      alert('Please add at least one necessity');
      return;
    }
    
    onSubmit({ name, necessities: validNecessities });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name/Community Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      
      <div className="space-y-3">
        <Label>Necessities</Label>
        {necessities.map((necessity, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                value={necessity.item}
                onChange={(e) => handleNecessityChange(index, 'item', e.target.value)}
                placeholder="Item name"
                required
              />
            </div>
            <div className="w-20">
              <Input
                type="number"
                min="1"
                value={necessity.quantity}
                onChange={(e) => handleNecessityChange(index, 'quantity', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="w-24">
              <Select
                value={necessity.unit}
                onValueChange={(value) => handleNecessityChange(index, 'unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeNecessityField(index)}
              disabled={necessities.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-agro-green-dark border-agro-green-dark"
          onClick={addNecessityField}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add More Items
        </Button>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-agro-green-dark hover:bg-agro-green-light">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddNecessityForm;
