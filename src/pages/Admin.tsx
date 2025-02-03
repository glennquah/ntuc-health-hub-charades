import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Admin() {
  const [newTopic, setNewTopic] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newInstructions, setNewInstructions] = useState('')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<number[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)

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

  const addWordMutation = useMutation({
    mutationFn: async ({
      topicId,
      translations,
    }: {
      topicId: number
      translations: Record<string, string>
    }) => {
      // Validate at least one translation
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

  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl font-bold text-center mb-4">Admin Panel</h1>

          {/* Add Topic Form */}
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

          {/* Topics and Words List */}
          <div className="space-y-6">
            {topics?.map((topic) => (
              <div
                key={topic.id}
                className="bg-white p-6 py-8 rounded-lg border border-gray justify-center items-center"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{topic.name}</h3>
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
                    {/* Add Word Form */}
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

                    {/* Words List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topic.words?.map((word) => (
                        <div
                          key={word.id}
                          className="bg-white p-4  border border-gray rounded group relative"
                        >
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteWordMutation.mutate(word.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {Object.entries(word.translations).map(
                            ([lang, translation]) => (
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
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
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
    </div>
  )
}
