'use client'

import type React from 'react'

import {useState} from 'react'
import {Button} from '@/ui/button'
import {Input} from '@/ui/input'
import {Label} from '@/ui/label'
import {Textarea} from '@/ui/textarea'
import toast from 'react-hot-toast'
import {Loader2} from 'lucide-react'
import {getAuthorizationHeader} from '@/utils/auth'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    seats: '',
    additionalInfo: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/workshop-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify({
          email: formData.email,
          seats: parseInt(formData.seats),
          additionalInfo: formData.additionalInfo,
          productTitle: 'Cursor Team Workshop',
        }),
      })

      toast.success(
        "Request submitted successfully! We'll be in touch with you shortly.",
      )

      // Reset form
      setFormData({
        email: '',
        seats: '',
        additionalInfo: '',
      })
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-white dark:bg-[#0c0f16] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seats" className="text-gray-700 dark:text-gray-300">
          Number of seats requested
        </Label>
        <Input
          id="seats"
          name="seats"
          type="number"
          min="5"
          placeholder="5"
          value={formData.seats}
          onChange={handleChange}
          required
          className="bg-white dark:bg-[#0c0f16] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="additionalInfo"
          className="text-gray-700 dark:text-gray-300"
        >
          Additional information
        </Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          placeholder="Tell us about your team, preferred dates, or any specific areas of interest..."
          value={formData.additionalInfo}
          onChange={handleChange}
          rows={4}
          className="bg-white dark:bg-[#0c0f16] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Contact Us'
        )}
      </Button>
    </form>
  )
}
