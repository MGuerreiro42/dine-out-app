import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ApiError } from '@/lib/apiClient';
import { StarRatingInput } from '@/components/ui';
import { useSubmitReviewMutation } from '@/features/reviews/api';

type FormErrors = {
  rating?: string;
  text?: string;
};

type ReviewFormSheetContentProps = {
  restaurantId: number;
  onSuccess: () => void;
};

export function ReviewFormSheetContent({ restaurantId, onSuccess }: ReviewFormSheetContentProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const mutation = useSubmitReviewMutation(restaurantId);

  const alreadyReviewed = mutation.error instanceof ApiError && mutation.error.status === 409;

  const handleRatingChange = (value: number) => {
    setRating(value);
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleTextChange = (value: string) => {
    setText(value);
    setErrors((prev) => ({ ...prev, text: undefined }));
  };

  const handleSubmit = () => {
    if (mutation.isPending) {
      return;
    }

    const nextErrors: FormErrors = {};
    if (rating === 0) {
      nextErrors.rating = 'Select a star rating';
    }
    if (text.trim().length === 0) {
      nextErrors.text = 'Write a few words about your visit';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    mutation.mutate(
      { rating, text: text.trim() },
      {
        onSuccess: () => onSuccess(),
      },
    );
  };

  return (
    <View>
      <Text className="mb-md text-lg font-bold text-ink">Write a review</Text>

      {alreadyReviewed ? (
        <View className="mb-md rounded-lg bg-danger-tint p-md">
          <Text className="text-sm font-bold text-danger">You already reviewed this restaurant</Text>
          <Text className="mt-xs text-xs text-danger">
            Each account can leave one review per restaurant.
          </Text>
        </View>
      ) : null}

      <View className="items-center gap-sm">
        <StarRatingInput value={rating} onChange={handleRatingChange} />
        {errors.rating ? <Text className="text-xs text-danger">{errors.rating}</Text> : null}
      </View>

      <View className="mt-lg">
        <Text className="mb-sm text-sm font-bold text-ink">Your review</Text>
        <TextInput
          placeholder="Share what stood out — the food, the service, the vibe..."
          value={text}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={4}
          maxLength={1000}
          className={`h-[104px] rounded-sm border px-md py-md text-sm ${errors.text ? 'border-danger' : 'border-sand'}`}
          textAlignVertical="top"
        />
        {errors.text ? <Text className="mt-xs text-xs text-danger">{errors.text}</Text> : null}
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={mutation.isPending}
        className={`mt-md2 items-center rounded-lg bg-ink py-md ${mutation.isPending ? 'opacity-60' : ''}`}
      >
        <Text className="text-sm font-bold text-white">Submit review</Text>
      </Pressable>
    </View>
  );
}
