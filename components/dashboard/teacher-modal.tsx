"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type GenderValue = 'male' | 'female' | 'unspecified'

export interface TeacherPayload {
  full_name: string
  email: string
  department: string
  joining_date: string
  gender: GenderValue
  password?: string
}

const GENDER_OPTIONS: Array<{ value: GenderValue; label: string }> = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unspecified', label: 'Unspecified' },
]

interface TeacherModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: 'add' | 'edit'
  teacherData?: {
    id: string
    name: string
    email: string
    department: string
    joining_date: string
    gender: string
  }
  onSuccess: (teacher: any) => void
}

function getDefaultFormState(): TeacherPayload {
  return {
    full_name: '',
    email: '',
    department: '',
    joining_date: new Date().toISOString().slice(0, 10),
    gender: 'male',
    password: '',
  }
}

function normalizeGenderValue(value: string): GenderValue {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'male' || normalized === 'female' || normalized === 'unspecified') {
    return normalized
  }
  return 'unspecified'
}

function formatInputDate(dateValue: string) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return dateValue.slice(0, 10)
  }
  return date.toISOString().slice(0, 10)
}

export function TeacherModal({
  isOpen,
  onOpenChange,
  mode,
  teacherData,
  onSuccess,
}: TeacherModalProps) {
  const [formState, setFormState] = useState<TeacherPayload>(getDefaultFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && teacherData) {
        setFormState({
          full_name: teacherData.name,
          email: teacherData.email,
          department: teacherData.department,
          joining_date: formatInputDate(teacherData.joining_date),
          gender: normalizeGenderValue(teacherData.gender),
        })
      } else {
        setFormState(getDefaultFormState())
      }
      setFormError(null)
    }
  }, [isOpen, mode, teacherData])

  function updateForm<K extends keyof TeacherPayload>(key: K, value: TeacherPayload[K]) {
    setFormState((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setFormError(null)

    const payload: TeacherPayload = {
      full_name: formState.full_name.trim(),
      email: formState.email.trim().toLowerCase(),
      department: formState.department.trim(),
      joining_date: formState.joining_date,
      gender: formState.gender,
    }

    if (mode === 'add') {
      payload.password = formState.password?.trim() ?? ''
    }

    if (!payload.full_name || !payload.email || !payload.department || !payload.joining_date) {
      setFormError('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    if (mode === 'add' && (!payload.password || payload.password.length < 8)) {
      setFormError('Password must be at least 8 characters.')
      setIsSubmitting(false)
      return
    }

    try {
      const endpoint = mode === 'add' ? '/api/teachers' : `/api/teachers/${teacherData?.id}`
      const method = mode === 'add' ? 'POST' : 'PATCH'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const body = (await response.json().catch(() => ({}))) as {
        error?: string
        data?: any
      }

      if (!response.ok || !body.data) {
        setFormError(body.error ?? 'Failed to save teacher changes.')
        return
      }

      onSuccess(body.data)
      onOpenChange(false)
    } catch {
      setFormError('Something went wrong while saving teacher data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Teacher' : 'Edit Teacher'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Create a new teacher account.'
              : 'Update teacher profile details.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          <div className="grid gap-3">
            <Label htmlFor="teacher-full-name">Full Name</Label>
            <Input
              id="teacher-full-name"
              value={formState.full_name}
              onChange={(event) => updateForm('full_name', event.target.value)}
              placeholder="Juan Dela Cruz"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="teacher-email">Email</Label>
            <Input
              id="teacher-email"
              type="email"
              value={formState.email}
              onChange={(event) => updateForm('email', event.target.value)}
              placeholder="teacher@school.edu"
            />
          </div>

          {mode === 'add' && (
            <div className="grid gap-3">
              <Label htmlFor="teacher-password">Password</Label>
              <Input
                id="teacher-password"
                type="password"
                value={formState.password ?? ''}
                onChange={(event) => updateForm('password', event.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="teacher-department">Department</Label>
            <Input
              id="teacher-department"
              value={formState.department}
              onChange={(event) => updateForm('department', event.target.value)}
              placeholder="Mathematics"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-3">
              <Label htmlFor="teacher-joining-date">Joining Date</Label>
              <Input
                id="teacher-joining-date"
                type="date"
                value={formState.joining_date}
                onChange={(event) => updateForm('joining_date', event.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="teacher-gender">Gender</Label>
              <select
                id="teacher-gender"
                value={formState.gender}
                onChange={(event) => updateForm('gender', event.target.value as GenderValue)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-600 mt-2">{formError}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-[#00754a] hover:bg-[#01653f] text-white"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (mode === 'add' ? 'Creating...' : 'Saving...')
              : (mode === 'add' ? 'Create Teacher' : 'Save Changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
