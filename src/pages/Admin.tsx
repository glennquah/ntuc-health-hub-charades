/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dashboards } from '@/components/Dashboards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, EditIcon, Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../public/icons.svg'

export default function Admin() {
  const [newTopic, setNewTopic] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newInstructions, setNewInstructions] = useState('')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<number[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)
  const [editingWordId, setEditingWordId] = useState<number | null>(null)
  const [editingTranslations, setEditingTranslations] = useState<
    Record<string, string>
  >({})
  // New state for editing topic
  const [editingTopic, setEditingTopic] = useState<{
    id: number
    name: string
    description: string
    instructions: string
  } | null>(null)

  const queryClient = useQueryClient()
  const languages = ['English', 'Chinese', 'Hokkien', 'Cantonese']

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*, words(*)')
      if (error) throw error
      return data
    },
  })

  const addTopicMutation = useMutation({
    mutationFn: async ({
      name,
      description,
      instructions,
    }: {
      name: string
      description: string
      instructions: string
    }) => {
      const { data, error } = await supabase
        .from('topics')
        .insert([{ name, description, instructions }])
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      setNewTopic('')
      setNewDescription('')
      setNewInstructions('')
      toast({
        title: 'Success',
        description: 'Topic added successfully',
      })
    },
  })

  const editTopicMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      instructions,
    }: {
      id: number
      name: string
      description: string
      instructions: string
    }) => {
      const { data, error } = await supabase
        .from('topics')
        .update({ name, description, instructions })
        .eq('id', id)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({
        title: 'Success',
        description: 'Topic updated successfully',
      })
    },
  })

  const deleteTopicMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('topics').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({
        title: 'Success',
        description: 'Topic deleted successfully',
      })
    },
  })

  const handleDeleteTopic = (topicId: number) => {
    deleteTopicMutation.mutate(topicId)
    setShowDeleteDialog(null)
  }

  const deleteWordMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('words').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({
        title: 'Success',
        description: 'Word deleted successfully',
      })
    },
  })

  const updateWordMutation = useMutation({
    mutationFn: async ({
      id,
      translations,
    }: {
      id: number
      translations: Record<string, string>
    }) => {
      if (Object.keys(translations).length === 0) {
        throw new Error('At least one translation is required')
      }
      const { data, error } = await supabase
        .from('words')
        .update({ translations })
        .eq('id', id)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({
        title: 'Success',
        description: 'Word updated successfully',
      })
    },
  })

  const addWordMutation = useMutation({
    mutationFn: async ({
      topicId,
      translations,
    }: {
      topicId: number
      translations: Record<string, string>
    }) => {
      if (Object.keys(translations).length === 0) {
        throw new Error('At least one translation is required')
      }
      const { data, error } = await supabase
        .from('words')
        .insert([{ topic_id: topicId, translations }])
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      setTranslations({})
      toast({
        title: 'Success',
        description: 'Word added successfully',
      })
    },
  })

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopic.trim() || !newDescription.trim() || !newInstructions.trim()) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        variant: 'destructive',
      })
      return
    }
    addTopicMutation.mutate({
      name: newTopic,
      description: newDescription,
      instructions: newInstructions,
    })
  }

  const handleAddWord = (topicId: number) => {
    if (Object.keys(translations).length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one translation',
        variant: 'destructive',
      })
      return
    }
    addWordMutation.mutate({ topicId, translations })
  }

  const toggleTopic = (topicId: number) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    )
  }

  const openEditDialog = (wordId: number) => {
    if (!topics) return
    let wordFound: any = null
    topics.forEach((topic: any) => {
      const found = topic.words?.find((w: any) => w.id === wordId)
      if (found) wordFound = found
    })
    if (wordFound) {
      setEditingWordId(wordId)
      setEditingTranslations(wordFound.translations)
    }
  }

  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-8">
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center justify-center py-4">
            <Link to="/">
              <img
                src={logo}
                alt="Lai Lai Guess Guess!"
                width={250}
                height={250}
                className="cursor-pointer"
              />
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">Admin Panel</h1>

          <div className="py-6">
            <h2 className="text-2xl font-semibold mb-4">Add New Deck</h2>
            <form onSubmit={handleAddTopic} className="space-y-4">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Enter topic name"
                className="w-full"
              />
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full"
              />
              <Textarea
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="Enter instructions"
                className="w-full"
              />
              <Button
                type="submit"
                disabled={addTopicMutation.isPending}
                className="text-lg px-8 py-4 border"
                variant="outline"
              >
                {addTopicMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Deck
              </Button>
            </form>
          </div>

          <hr className="border-t border-black py-2" />

          <div className="space-y-6">
            {topics?.map((topic: any) => (
              <div
                key={topic.id}
                className="bg-white p-6 py-8 rounded-lg border border-gray justify-center items-center"
              >
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <h3 className="text-xl font-semibold md:pb-0 pb-4">
                    {topic.name}
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => toggleTopic(topic.id)}
                      className="text-lg px-8 py-4 border border-black"
                      variant="outline"
                    >
                      {expandedTopics.includes(topic.id) ? 'Hide' : 'Show'}{' '}
                      Words
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setEditingTopic({
                          id: topic.id,
                          name: topic.name,
                          description: topic.description,
                          instructions: topic.instructions,
                        })
                      }
                      className="text-lg p-2 border border-black bg-green-700 text-white"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowDeleteDialog(topic.id)}
                      className="text-lg p-2 border border-black bg-red-500 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expandedTopics.includes(topic.id) && (
                  <div className="space-y-4 pt-4">
                    <div className="text-sm">
                      Description: {topic.description}
                    </div>
                    <div className="text-sm">
                      Instructions: {topic.instructions}
                    </div>
                    <div className="bg-white p-4 py-6 rounded-lg border border-gray">
                      <h4 className="font-semibold mb-2">Add New Word</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {languages.map((lang) => (
                          <Input
                            key={lang}
                            value={translations[lang] || ''}
                            onChange={(e) =>
                              setTranslations((prev) => ({
                                ...prev,
                                [lang]: e.target.value,
                              }))
                            }
                            placeholder={`${lang} translation (optional)`}
                          />
                        ))}
                      </div>
                      <Button
                        onClick={() => handleAddWord(topic.id)}
                        disabled={addWordMutation.isPending}
                        className="text-lg px-8 py-4 border border-black"
                        variant="outline"
                      >
                        {addWordMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        Add Word
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topic.words?.map((word: any) => (
                        <div
                          key={word.id}
                          className="bg-white p-4 border border-gray rounded group relative"
                        >
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-8"
                            onClick={() => openEditDialog(word.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => deleteWordMutation.mutate(word.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {Object.entries(word.translations).map(
                            ([lang, translation]: [string, string]) => (
                              <div key={lang} className="text-sm mt-4">
                                <span className="font-semibold">{lang}:</span>{' '}
                                {translation}
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pt-8">
            <hr className="border-t border-black p-2" />
            <p className="text-xl font-semibold">Admin Dashboards</p>
            <Dashboards />
          </div>
        </div>
      </div>
      {showDeleteDialog !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg space-y-4 text-center">
            <h3 className="text-2xl font-semibold">Confirm Delete</h3>
            <p>Are you sure you want to delete this topic?</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={() => handleDeleteTopic(showDeleteDialog)}
                className="bg-red-500 text-white px-6 py-2"
              >
                Yes, Delete
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(null)}
                className="bg-gray-300 px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {editingWordId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg space-y-4 text-center">
            <h3 className="text-2xl font-semibold">Edit Word</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((lang) => (
                <Input
                  key={lang}
                  value={editingTranslations[lang] || ''}
                  onChange={(e) =>
                    setEditingTranslations((prev) => ({
                      ...prev,
                      [lang]: e.target.value,
                    }))
                  }
                  placeholder={`${lang} translation`}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={() => {
                  if (editingWordId) {
                    updateWordMutation.mutate({
                      id: editingWordId,
                      translations: editingTranslations,
                    })
                    setEditingWordId(null)
                    setEditingTranslations({})
                  }
                }}
                className="bg-blue-500 text-white px-6 py-2"
                disabled={updateWordMutation.isPending}
              >
                {updateWordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  'Save'
                )}
              </Button>
              <Button
                onClick={() => {
                  setEditingWordId(null)
                  setEditingTranslations({})
                }}
                className="bg-gray-300 px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {editingTopic !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg space-y-4 text-center w-full max-w-[700px] mx-4">
            <h3 className="text-2xl font-semibold">Edit Topic / Decks</h3>
            <Input
              value={editingTopic.name}
              onChange={(e) =>
                setEditingTopic((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              placeholder="Topic Name"
              className="w-full"
            />
            <Textarea
              value={editingTopic.description}
              onChange={(e) =>
                setEditingTopic((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev
                )
              }
              placeholder="Topic Description"
              className="w-full h-32"
            />
            <Textarea
              value={editingTopic.instructions}
              onChange={(e) =>
                setEditingTopic((prev) =>
                  prev ? { ...prev, instructions: e.target.value } : prev
                )
              }
              placeholder="Topic Instructions"
              className="w-full h-32"
            />
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={() => {
                  if (editingTopic) {
                    editTopicMutation.mutate({
                      id: editingTopic.id,
                      name: editingTopic.name,
                      description: editingTopic.description,
                      instructions: editingTopic.instructions,
                    })
                    setEditingTopic(null)
                  }
                }}
                className="bg-blue-500 text-white px-6 py-2"
                disabled={editTopicMutation.isPending}
              >
                {editTopicMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  'Save'
                )}
              </Button>
              <Button
                onClick={() => setEditingTopic(null)}
                className="bg-gray-300 px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
