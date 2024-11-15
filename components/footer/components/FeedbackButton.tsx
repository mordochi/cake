import { track } from '@amplitude/analytics-browser';
import { Button, Image } from '@chakra-ui/react';
import iconFeedback from '@icons/feedback.png';

const FeedbackButton = () => {
  return (
    <Button
      as="a"
      href="https://bento-batch.canny.io/feedback"
      target="_blank"
      size="xs"
      variant="secondary"
      width="fit-content"
      h="24px"
      onClick={() => {
        track('footer_click_feedback');
      }}
    >
      <Image
        alt="Leave us a feedback"
        src={iconFeedback.src}
        width="14px"
        mr="4px"
        mb="2px"
      />
      Leave us a feedback
    </Button>
  );
};

export default FeedbackButton;
