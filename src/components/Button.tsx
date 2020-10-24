import styled from "@emotion/styled";

/**
 * Button component for global style/consistency. Uses all HTML button props
 * as well.
 *
 * ```jsx
 * <Button width="4rem">
 *   Button Text
 * </Button>
 * ```
 */

export interface ButtonProps {
  // Defaults to 'auto' if not passed in
  width?: string;
}

const Button = styled.button<ButtonProps>`
  background: var(--primary);
  border-radius: 0.25rem;
  border: 0;
  color: #fff;
  padding: 0.5rem 0.75rem;
  width: ${({ width = "auto" }) => width};
  transition: all 100ms;

  &:hover {
    opacity: 0.8;
  }
`;

export default Button;
