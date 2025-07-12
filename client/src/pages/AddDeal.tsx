import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { dealInsertSchema, type DealInsert } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';

export default function AddDeal() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DealInsert>({
    resolver: zodResolver(dealInsertSchema),
    defaultValues: {
      title: '',
      clientName: '',
      clientEmail: '',
      value: 0,
      stage: 'prospect',
      probability: 10,
      expectedCloseDate: '',
      assignedTo: '',
      notes: '',
    },
  });

  const createDealMutation = useMutation({
    mutationFn: (dealData: DealInsert) => 
      apiRequest('/api/deals', {
        method: 'POST',
        body: JSON.stringify(dealData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/pipeline-summary'] });
      setLocation('/pipeline');
    },
  });

  const onSubmit = async (data: DealInsert) => {
    setIsSubmitting(true);
    try {
      await createDealMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to create deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stageOptions = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Deal</h1>
        <p className="text-muted-foreground">
          Create a new deal to track in your sales pipeline
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Deal Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Enter deal title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  {...form.register('clientName')}
                  placeholder="Enter client name"
                />
                {form.formState.errors.clientName && (
                  <p className="text-sm text-destructive">{form.formState.errors.clientName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...form.register('clientEmail')}
                  placeholder="client@company.com"
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.clientEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Deal Value ($) *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  {...form.register('value', { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {form.formState.errors.value && (
                  <p className="text-sm text-destructive">{form.formState.errors.value.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage *</Label>
                <Select
                  id="stage"
                  {...form.register('stage')}
                >
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                {form.formState.errors.stage && (
                  <p className="text-sm text-destructive">{form.formState.errors.stage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%) *</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  {...form.register('probability', { valueAsNumber: true })}
                  placeholder="10"
                />
                {form.formState.errors.probability && (
                  <p className="text-sm text-destructive">{form.formState.errors.probability.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  {...form.register('expectedCloseDate')}
                />
                {form.formState.errors.expectedCloseDate && (
                  <p className="text-sm text-destructive">{form.formState.errors.expectedCloseDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To *</Label>
                <Input
                  id="assignedTo"
                  {...form.register('assignedTo')}
                  placeholder="HR Manager name"
                />
                {form.formState.errors.assignedTo && (
                  <p className="text-sm text-destructive">{form.formState.errors.assignedTo.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                {...form.register('notes')}
                placeholder="Additional notes about the deal..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating Deal...' : 'Create Deal'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/pipeline')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}